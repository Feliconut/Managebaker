<?php
namespace App\Api;

use PhalApi\Api;
use App\Domain\User as UserCURD;

/**
 * User service
 */
class User extends Api
{
    public function getRules()
    {
        return array(
            'login' => array(
                'id' => array('name' => 'id', 'require' => true, 'min' => 8, 'max' => 8, 'desc' => 'id'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'client_token'),
            ),
            'register' => array(
                'id' => array('name' => 'id', 'require' => true, 'min' => 8, 'max' => 8, 'desc' => 'id'),
                'school' => array('name' => 'school', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'school'),
                'region' => array('name' => 'region', 'require' => true, 'min' => 2, 'max' => 3, 'desc' => 'region'),
                'first_name' => array('name' => 'first_name', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'first_name'),
                'last_name' => array('name' => 'last_name', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'last_name'),
                'prefer_name' => array('name' => 'prefer_name', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'prefer_name'),
                'email' => array('name' => 'email', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'email'),
                'photo' => array('name' => 'photo', 'require' => true, 'desc' => 'photo in base 64'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'client_token'),
            ),
            'info' => array(
                'authorization' => array('name' => 'Authorization', 'source' => 'header', 'require' => true)
            ),
            'upload' => array(
                'id' => array('name' => 'id', 'require' => true, 'min' => 8, 'max' => 8, 'desc' => 'id'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'client_token'),
                'date' => array('name' => 'date', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'date'),
                'data' => array('name' => 'data', 'desc' => 'data')
            ),
            'recoverlist' => array(
                'id' => array('name' => 'id', 'require' => true, 'min' => 8, 'max' => 8, 'desc' => 'id'),
                'date' => array('name' => 'date', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'date'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'client_token'),
            ),
            'recoverdata' => array(
                'id' => array('name' => 'id', 'require' => true, 'min' => 8, 'max' => 8, 'desc' => 'id'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'client_token'),
                'time' => array('name' => 'time', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'key'),
            ),
            'cleandata' => array(
                'code' => array('name' => 'code', 'required' => true, 'min' => 32, 'max' => 32, 'desc' => 'code'),
            ),
        );
    }

    /**
     * Managebaker login
     * @desc Managebaker login API
     * @return string status 
     */
    public function login()
    {
        $domain = new UserCURD();
        $result = $domain->login($this->id, $this->client_token);
        if ($result['status'] == 'failed') {
            return array('status' => 'failed');
        }
        return array('status' => 'success', 'access_token' => $result['token'], 'expire' => $result['time'] + 1800);
    }

    /**
     * Managebaker register
     * @desc Managebaker register
     * @return string status {success,failed}
     * @return string access_token access_token
     * @return int expire expire time of token
     */
    public function register()
    {
        $md5 = md5($this->school . $this->region . $this->email . 'Managebaker');
        if ($md5 === $this->client_token) {
            $Data = array(
                'id' => $this->id,
                'school' => $this->school,
                'region' => $this->region,
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'photo' => $this->photo,
                'prefer_name' => $this->prefer_name,
                'email' => $this->email,
                'time' => time()
            );
            $domain = new UserCURD();
            $domain->register($Data);
            return array('status' => 'success', 'access_token' => $Data['managebaker_token'], 'expire' => $Data['token_expire']);
        } else {
            return array('status' => 'failed');
        }
    }

    /**
     * Managebaker User Info for discuss ONLY
     * @desc used for oauth only
     * @return string id id of user 
     * @return string email email address of user
     * @return string name username
     * @return string photo photo in base64
     */
    public function info()
    {
        $domain = new UserCURD();
        $code = substr($this->authorization, 7);
        $userid = \PhalApi\DI()->cache->get($code);
        $data = $domain->get($userid);
        \PhalApi\DI()->cache->delete($code);
        return array('id' => $data['id'], 'email' => $data['email'], 'name' => str_replace(".", "_", str_replace("@", "_", $data['email'])), 'photo' => $data['photo']);
    }
    /**
     * Managebaker upload data
     * @desc backup user data
     * @return string status success or fail
     */
    public function upload()
    {
        $domain = new UserCURD();
        $result = $domain->login($this->id, $this->client_token);
        if ($result['status'] != 'failed') {
            $domain->upload($this->id, $this->data, $this->date);
            return 'success';
        } else {
            return array('status' => 'failed');
        }
    }


    public function recoverlist()
    {
        //return $this->id;
        $domain = new UserCURD();
        $result = $domain->login($this->id, $this->client_token);
        if ($result['status'] != 'failed') {
            $list = $domain->recoverlist($this->id, $this->date);
            return $list;
        } else {
            return array('status' => 'failed');
        }
    }


    public function recoverdata()
    {
        $domain = new UserCURD();
        $result = $domain->login($this->id, $this->client_token);
        if ($result['status'] != 'failed') {
            $data = $domain->recoverdata($this->id, $this->time);
            return $data;
        } else {
            return array('status' => 'failed');
        }
    }

    public function cleandata()
    {
        //API https://managebaker.com/API/public/user/cleandata?code=064fd214283f698da1a70b9d4833a9e6
        if ($this->code == '064fd214283f698da1a70b9d4833a9e6') {
            $domain = new UserCURD();
            $data = $domain->cleandata();
            return $data;
        }
    }
}
