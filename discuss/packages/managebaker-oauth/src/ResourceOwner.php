<?php

namespace Managebaker\Oauth;

use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use League\OAuth2\Client\Tool\ArrayAccessorTrait;

class ResourceOwner implements ResourceOwnerInterface
{
    use ArrayAccessorTrait;
    /**
     * @var array
     */
    private $response;
    function __construct(array $response = [])
    {
        $this->response = $response;
    }
    /**
     * Returns the identifier of the authorized resource owner.
     *
     * @return mixed
     */
    public function getId()
    {
        return $this->getValueByKey($this->response, 'id');
    }
    /**
     * Get resource owner email
     *
     * @return string|null
     */
    public function getEmail()
    {
        return $this->getValueByKey($this->response, 'email');
    }
    /**
     * Get resource owner name
     *
     * @return string|null
     */
    public function getName()
    {
        return $this->getValueByKey($this->response, 'name');
    }
    /**
     * Get resource owner photo
     *
     * @return string|null
     */
    public function getPhoto()
    {
        return $this->getValueByKey($this->response, 'photo');
    }
    /**
     * Return all of the owner details available as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return $this->response;
    }
}
