<?php
namespace App\Model;

use PhalApi\Model\NotORMModel as NotORM;


class User extends NotORM
{

    protected function getTableName($id)
    {
        return 'user';
    }
    public function usernumber()
    {
        return $this->getORM()
            ->count("id");
    }

    /*
    public function getListItems($state, $page, $perpage) {
        return $this->getORM()
            ->select('*')
            ->where('state', $state)
            ->order('post_date DESC')
            ->limit(($page - 1) * $perpage, $perpage)
            ->fetchAll();
    }

    public function getListTotal($state) {
        $total = $this->getORM()
            ->where('state', $state)
            ->count('id');

        return intval($total);
    }
    */
}
