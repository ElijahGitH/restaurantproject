
async function Add(userType,username,password){
    if (userType == 0){
        let doc = {
            "username": username,
            "password": password,
        };

        let response = await fetch("http://localhost:5000/customer",
            {
                method: "POST",
                body: JSON.stringify(doc),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    if(userType == 1){
        let doc = {
            "username": username,
            "password": password,
        };

        let response = await fetch("http://localhost:5000/admin",
            {
                method: "POST",
                body: JSON.stringify(doc),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

export default Add;