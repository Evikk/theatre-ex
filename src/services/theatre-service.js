import { storageService } from "./storage-service"

export const theatreService={
    query,
    setTheatre

}


function query(){
    const theatre=storageService.load('theatre')
    return theatre?theatre:null
}


function setTheatre(theatre){
    storageService.save('theatre',theatre)
}