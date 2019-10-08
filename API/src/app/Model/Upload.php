<?php
namespace App\Model;

use PhalApi\Model\NotORMModel as NotORM;


class Upload extends NotORM
{

    protected function getTableName($id)
    {
        return 'upload';
    }

    public function getListItems($id, $date)
    {
        return $this->getORM()
            ->select('time')
            ->where('id', $id)
            ->where('date', $date)
            ->fetchAll();
    }

    public function getItem($id, $time)
    {
        return $this->getORM()
            ->select('data')
            ->where('id', $id)
            ->where('time', $time)
            ->fetchAll();
    }

    public function cleandata()
    {
        return $this->getORM()
            ->select('*')
            ->where('time < ?', time() - 30 * 24 * 60 * 60)
            ->delete();
    }
}
