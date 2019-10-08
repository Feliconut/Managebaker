<?php
namespace App\Common;

class Request extends \PhalApi\Request {

    public function getService() {
        // 优先返回自定义格式的接口服务名称
        $service = $this->get('s');
        if (!empty($service)) {
            $namespace = count(explode('/', $service)) == 2 ? 'App.' : '';
            return $namespace . str_replace('/', '.', $service);
        }
        return parent::getService();
    }
}