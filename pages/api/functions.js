import stuff from './stuff'

export function deepSearchForProfane(string) {

    for (let i = 0; i < stuff.length; i++) {
        if (string.toLowerCase().includes(stuff[i])) return true
    }

    return false
}

export function hasProfane(string) {
    let elements = string.split(" ")
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (stuff.includes(element.toLowerCase())) {
            return true
        }
    }

    return false
}