export function classSetting(name){
    const matchingDict = [
        {key:"chine",abbr:"CHN",color:"#E67E22"},
        {key:"engli",abbr:"ENG",color:"#E67E22"},
        {key:"econ",abbr:"ECON",color:"#F1C40F"},
        {key:"psych",abbr:"PSY",color:"#F1C40F"},
        {key:"hist",abbr:"HIS",color:"#F1C40F"},
        {key:"mathe",abbr:"MTH",color:"#D35400"},
        {key:"environ",abbr:"ESS",color:"#3498DB"},
        {key:"phy",abbr:"PHY",color:"#3498DB"},
        {key:"chemi",abbr:"CHEM",color:"#3498DB"},
        {key:"biolo",abbr:"BIO",color:"#3498DB"},
        {key:"design",abbr:"DT",color:"#3498DB"},
        {key:"music",abbr:"MUS",color:"#1ABC9C"},
        {key:"visual",abbr:"VA",color:"#1ABC9C"},
        {key:"theatre",abbr:"THE",color:"#1ABC9C"},
        {key:"theory",abbr:"TOK",color:"#9B59B6"},
        {key:"elective",abbr:"elec",color:"#27AE60"}
    ]
    var return_setting = {
        name:name,
        abbr:name.slice(0,3).toUpperCase(),
        color:"#27AE60",
        method:0
    }
    matchingDict.forEach(match=>{
        if(name.toLowerCase().indexOf(match.key)+1){
            return_setting.abbr = match.abbr;
            return_setting.color = match.color;
        }
    })
    return return_setting;
    
}
