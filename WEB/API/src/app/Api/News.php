<?php
namespace App\Api;

use PhalApi\Api;

/**
 * 用户模块接口服务
 */
class News extends Api {
   
    /**
     * 新闻接口
     * @desc NEWS for managebaker
     * @return 
     **/
    public function info() {       
        return array('news' => " ");
    }
} 
