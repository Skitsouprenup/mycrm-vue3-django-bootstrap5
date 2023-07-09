import { Ref } from "vue"

export type unknownObjectType = { [index: string] : unknown }

export const getObjectProperty = (
    obj : unknown, 
    key: string) : string => {

    if(typeof(obj) === 'object') {
        const object : unknownObjectType = obj as unknownObjectType
        if(!object) return ''

        let exists = false
        for(const objKey of Object.keys(object)) {
            if(objKey === key) {
                exists = true;
                break;
            }
        }

        const string =  exists ? object[key] : ''
        return string as string
    } else return obj as string
}

export const getObjectRefProperty = (
    obj : Ref<unknownObjectType>, 
    key: string) : string => {

    if(typeof(obj.value) === 'object') {
        const object : unknownObjectType = obj.value
        if(!object) return ''

        let exists = false
        for(const objKey of Object.keys(object)) {
            if(objKey === key) {
                exists = true;
                break;
            }
        }

        const string =  exists ? object[key] : ''
        return string as string
    } else return obj.value as string
}

export const getRefFormObjProperty = (obj: Ref<unknownObjectType | null>, key: string) => {
    let name : unknown = ''
    
    if(obj?.value) {
        switch(key) {
            case 'created_at':
            case 'modified_at':
                const date = new Date(obj.value[key] as string)
                name = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                break;
            
            default:
                name = obj.value[key]
        }
    }
    return name ? name : ''
  }