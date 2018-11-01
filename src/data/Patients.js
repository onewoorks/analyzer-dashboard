const patients = {
    patients: [
        { id:1, name: "ali", age: "20" },
        { id:2, name: "ahmad", age: 43 },
        { id:3, name: "maslan", age: 42 },
        { id:4, name: "zali", age: 12 },
        { id: 5, name: "malik", age: 12 },
        { id: 6, name: "harun", age: 12 },
        { id: 7, name: "fazli", age: 12 }
    ],
    get: function(pid){
        let patient = this.patients.find(p => p.id === pid)
        return patient
    }
}

export default patients