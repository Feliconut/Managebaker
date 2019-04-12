<?php
namespace App\Api;

use PhalApi\Api;

/**
 * Info service
 */
class Info extends Api
{
    public function getRules()
    {
        return array(
            'news' => array(
            'version'  => array('name' => 'version', 'default' => '0.0.0', 'desc' => 'current version'),
        )
    );
    }
    /**
     * News service
     * @desc give news to client
     * @return array news context is news;</br> pr is the priority of this piece of news(0-1; 1 for display for all;0 for never display);</br>version is used to match the extension version. if extension version matches, then show the news context with priority. Else use 'else' with priority.
     * @return int time timestrap
     */
    public function news()
    {
        $release_version = '4.0.0';
        $match_version = explode(".", $release_version);
        $request_version = explode(".", $this->version);
        $news=array();
        if ($request_version[0] == $match_version[0] && $request_version[1] == $match_version[1] && $request_version[2] == $match_version[2]) {
            //current version
            $context = array('context'=>'Find new features in version 4.0.0 <a href="https://managebaker.com/discuss/d/2-we-released-version-4-0-0" target="_blank">here</a>','pr'=>'0.6','expire'=>strtotime('2019-04-30'));
            array_push($news,$context);
        } else {
            $context = array('context'=>'We released version 4.0.0, pleases update','pr'=>'1.0','expire'=>strtotime('2019-12-31'));
            array_push($news,$context);
        }    

        $context = array('context'=>'Due to the update of Managebac, we are fixing new bugs.','pr'=>'1.0','expire'=>strtotime('2019-12-31'));
            array_push($news,$context);
            
           return array(
            'news' => $news,
            'time' => $_SERVER['REQUEST_TIME'],
        );
    }
}

