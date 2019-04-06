<?php
namespace App\Api;
use PhalApi\Api;

/**
 * Info service
 */
class Info extends Api {
    public function getRules() {
        return array();
    }

    /**
     * News service
     * @desc give news to client
     * @return array news context is news;</br> pr is the priority of this piece of news(0-1; 1 for display for all;0 for never display);</br>verson is used to match the extension verson. if extension verson matches, then show the news context with priority. Else use 'else' with priority.
     * @return int time timestrap
     */
    public function news() {
        $news = array(['context'=>'123e','matches'=>[['pr'=>'1.0','verson'=>'0.1.1'],['pr'=>'0.0','verson'=>'else']]],['sd'=>'12']);

        return array(
            'news' => $news,
            'time' => $_SERVER['REQUEST_TIME'],
        );
    }
}