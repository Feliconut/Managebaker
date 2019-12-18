<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Api\Serializers\TaskSerializer;
use Flagrow\Bazaar\Models\Task;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListTaskController extends AbstractListController
{
    use AssertPermissionTrait;

    /**
     * {@inheritdoc}
     */
    public $serializer = TaskSerializer::class;

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        return Task::orderBy('created_at', 'desc')->get();
    }
}
