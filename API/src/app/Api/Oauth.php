<?php
namespace App\Api;

use PhalApi\Api;
use App\Domain\User as UserCURD;

/**
 * Oauth service
 */
class Oauth extends Api
{
    public function getRules()
    {
        return array(
            'authorize' => array(
                'id' => array('name' => 'id', 'require' => true, 'min' => 8, 'max' => 8, 'desc' => 'id'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'client_token'),
                'scope' => array('name' => 'scope', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'scope'),
                'redirect_uri' => array('name' => 'redirect_uri', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'region'),
                'response_type' => array('name' => 'response_type', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'id'),
                'approval_prompt' => array('name' => 'approval_prompt', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'id'),
                'client_id' => array('name' => 'client_id', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'id'),
                'state' => array('name' => 'state', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'id'),
                'client_token' => array('name' => 'client_token', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'id'),
            ),
            'token' => array(
                'code' => array('name' => 'code', 'require' => true, 'min' => 1, 'max' => 100, 'desc' => 'id'),
            )
        );
    }
    /**
     * authorize
     * @desc authorize
     * @return string redirect_uri
     */
    public function authorize()
    {
        //if ($this->scope == 'code' && $this->redirect_uri == 'https%3A%2F%2Fmanagebaker.com%2Fauth%2Fmanagebaker' && $this->response_type == 'code' && $this->approval_prompt == 'auto' && $this->client_id == '7c36d055dd380288221e65e79455ac82') {
            $domain = new UserCURD();
            $client_token_result = $domain->login($this->id, $this->client_token);
            if ($client_token_result['status'] != 'failed') {
                $discuss_token = $domain->authorize($this->id);
                return array('redirect_uri' => 'https://managebaker.com/discuss/auth/managebaker?code=' . $discuss_token . '&state=' . $this->state);
            } else {
                return array('status' => 'failed');
            }
        //} else {
        //    return "Check Oauth";
        //}
    }

    public function token()
    {
        $domain = new UserCURD();
        $client_token_result = $domain->access_token($this->code);
        return array('access_token' => $client_token_result, 'expires' => 3600);
    }

}
