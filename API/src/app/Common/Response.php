<?php
// 新建 ./src/app/Common/MyResponse.php 文件

namespace App\Common;

use PhalApi\Response\JsonResponse ;

class Response extends JsonResponse {
    public function getResult() {
        // 只返回data部分
        $rs = parent::getResult();
        return $rs['data'];
    }
}