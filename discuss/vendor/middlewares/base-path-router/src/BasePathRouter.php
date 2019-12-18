<?php
declare(strict_types = 1);

namespace Middlewares;

use Middlewares\Utils\Factory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class BasePathRouter implements MiddlewareInterface
{
    /**
     * @var array
     */
    private $middlewares;

    /**
     * @var bool
     */
    private $stripPrefix = true;

    /**
     * @var Handler
     */
    private $defaultHandler;

    /**
     * @var string Attribute name for handler reference
     */
    private $attribute = 'request-handler';

    public function __construct(array $middlewares)
    {
        $this->middlewares = $middlewares;

        // Make sure the longest path prefixes are matched first
        // (otherwise, a path /foo would always match, even when /foo/bar
        // should match).
        krsort($this->middlewares);
    }

    /**
     * Set the attribute name to store handler reference.
     */
    public function attribute(string $attribute): self
    {
        $this->attribute = $attribute;

        return $this;
    }

    /**
     * Should the matched prefix be stripped from the request?
     *
     * This method allows disabling the stripping of matching request prefixes.
     * By default, the router strips matching prefixes from the URI path before
     * passing on the request to subsequent middleware / request handlers.
     *
     * When this method is called without parameters, the default (enable prefix
     * stripping) will be used.
     */
    public function stripPrefix(bool $strip = true): self
    {
        $this->stripPrefix = $strip;

        return $this;
    }

    /**
     * Provide a default request handler
     *
     * This request handler will be assigned to the current request whenever no
     * prefix matches. By default, an empty 404 response will be returned.
     *
     * @param mixed $handler
     */
    public function defaultHandler($handler): self
    {
        $this->defaultHandler = $handler;

        return $this;
    }

    /**
     * Process a server request and return a response.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $requestPath = $this->getNormalizedPath($request);

        foreach ($this->middlewares as $pathPrefix => $middleware) {
            if (strpos($requestPath, $pathPrefix) === 0) {
                return $handler->handle(
                    $this->unprefixedRequest($request, $pathPrefix)
                        ->withAttribute($this->attribute, $middleware)
                );
            }
        }

        if ($this->defaultHandler) {
            return $handler->handle(
                $request->withAttribute($this->attribute, $this->defaultHandler)
            );
        }

        return Factory::createResponse(404);
    }

    private function unprefixedRequest(ServerRequestInterface $request, string $prefix): ServerRequestInterface
    {
        if (!$this->stripPrefix) {
            return $request;
        }

        $uri = $request->getUri();

        return $request->withUri(
            $uri->withPath(
                '/'.ltrim(substr($uri->getPath(), strlen($prefix)), '/')
            )
        );
    }

    private function getNormalizedPath(ServerRequestInterface $request): string
    {
        $path = $request->getUri()->getPath();

        if (empty($path)) {
            $path = '/';
        }

        return $path;
    }
}
