<?php
/**
 * @see       https://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2016-2018 Zend Technologies USA Inc. (https://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

declare(strict_types=1);

namespace Zend\Stratigility\Exception;

use OutOfBoundsException;

use function get_class;
use function gettype;
use function is_object;
use function sprintf;

/**
 * Exception thrown when the internal stack of Zend\Stratigility\Next is
 * exhausted, but no response returned.
 */
class MissingResponseException extends OutOfBoundsException implements ExceptionInterface
{
    public static function forCallableMiddleware(callable $middleware) : self
    {
        $type = is_object($middleware)
            ? get_class($middleware)
            : gettype($middleware);

        return new self(sprintf(
            'Decorated callable middleware of type %s failed to produce a response.',
            $type
        ));
    }
}
