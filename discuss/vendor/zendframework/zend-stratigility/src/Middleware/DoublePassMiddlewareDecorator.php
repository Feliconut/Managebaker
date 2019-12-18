<?php
/**
 * @see       https://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2017-2018 Zend Technologies USA Inc. (https://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

declare(strict_types=1);

namespace Zend\Stratigility\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;
use Zend\Stratigility\Exception;

use function class_exists;

/**
 * Decorate double-pass middleware as PSR-15 middleware.
 *
 * Decorates middleware with the following signature:
 *
 * <code>
 * function (
 *     ServerRequestInterface $request,
 *     ResponseInterface $response,
 *     callable $next
 * ) : ResponseInterface
 * </code>
 *
 * such that it will operate as PSR-15 middleware.
 *
 * Neither the arguments nor the return value need be typehinted; however, if
 * the signature is incompatible, a PHP Error will likely be thrown.
 */
final class DoublePassMiddlewareDecorator implements MiddlewareInterface
{
    /**
     * @var callable
     */
    private $middleware;

    /**
     * @var ResponseInterface
     */
    private $responsePrototype;

    /**
     * @throws Exception\MissingResponsePrototypeException if no response
     *     prototype is present, and zend-diactoros is not installed.
     */
    public function __construct(callable $middleware, ResponseInterface $responsePrototype = null)
    {
        $this->middleware = $middleware;

        if (! $responsePrototype && ! class_exists(Response::class)) {
            throw Exception\MissingResponsePrototypeException::create();
        }

        $this->responsePrototype = $responsePrototype ?? new Response();
    }

    /**
     * {@inheritDoc}
     * @throws Exception\MissingResponseException if the decorated middleware
     *     fails to produce a response.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface
    {
        $response = ($this->middleware)(
            $request,
            $this->responsePrototype,
            $this->decorateHandler($handler)
        );

        if (! $response instanceof ResponseInterface) {
            throw Exception\MissingResponseException::forCallableMiddleware($this->middleware);
        }

        return $response;
    }

    private function decorateHandler(RequestHandlerInterface $handler) : callable
    {
        return function ($request, $response) use ($handler) {
            return $handler->handle($request);
        };
    }
}
