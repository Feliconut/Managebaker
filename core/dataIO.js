/*
数据管理模块，导入和导出用户数据
*/
export const packer = {
    //return string containing all user data
    packup: () => {},
    //write all data into localforage, return stat code
    unpack: (dataString) => {}
}

export const security = {
    //return encrypted string
    encryp: (raw, key) => {},
    //return decrypted string
    decryp: (encrypted, key) => {},
}

export const dataIO = {
    local: {
        //return read string
        read: () => {},
        //return status code
        write: (data, path, mode) => {}
    },
    online: {
        //return read string
        read: () => {},
        //return status code
        write: (data, mode) => {}
    }
}