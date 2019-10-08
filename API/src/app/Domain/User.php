<?php
namespace App\Domain;

use App\Model\User as UserCURD;
use App\Model\Upload as UploadCURD;

class User
{
    public function login($id, $client_token)
    {
        $model = new UserCURD();
        $data = $model->get($id);
        $md5 = md5($data['school'] . $data['region'] . $data["email"] . 'Managebaker');
        if ($md5 === $client_token) {
            $data['time'] = time();
            $model->update($id, $data);
            $data['status'] = 'success';
            return $data;
        } else {
            return array('status' => 'failed');
        }
    }

    public function register($newData)
    {
        $model = new UserCURD();
        if (!$model->get($newData['id'])) {
            return $model->insert($newData);
        } else {
            return $model->update($newData['id'], $newData);
        }
    }

    public function authorize($id)
    {
        $discuss_token = md5(uniqid(microtime(true), true));
        \PhalApi\DI()->cache->set($discuss_token, $id, 600);
        return $discuss_token;
    }

    public function get($id)
    {
        $model = new UserCURD;
        return $model->get($id);
    }

    public function access_token($code)
    {
        $id = \PhalApi\DI()->cache->get($code);
        $access_token = md5(uniqid(microtime(true), true));
        \PhalApi\DI()->cache->set($access_token, $id, 600);
        \PhalApi\DI()->cache->delete($code);
        return $access_token;
    }

    public function upload($id, $data, $date)
    {
        $model = new UploadCURD;
        $array = array(
            'key' => $id . time(),
            'id' => $id,
            'data' => $data,
            'date' => $date,
            'time' => time()
        );
        if (!$model->get($array['id'])) {
            $model->insert($array);
        }
        return 'success';
    }

    public function recoverlist($id, $date)
    {
        $model = new UploadCURD;
        $list = $model->getListItems($id, $date);
        return $list;
    }

    public function recoverdata($id, $time)
    {
        $model = new UploadCURD;
        $data = $model->getItem($id, $time);
        return $data;
    }

    public function cleandata()
    {
        $model = new UploadCURD;
        $data = $model->cleandata();
        return $data;
    }

    public function usernumber()
    {
        $model = new UserCURD;
        $data = $model->usernumber();
        return $data;
    }
}
