let umur = 15

try{
    if(umur>1 && umur < 17){
        throw "masih di bawah umur"
    }else if (umur > 18){
        console.log ("kamu sudah dewasa, umur kamu: " + umur)
    }else{
        console.log ("kamu salah input")
    }
}catch (error){
    console.log ("error : " + error)
}