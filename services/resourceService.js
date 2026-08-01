const db = require("../config/db");

function getAllResources(callback) {
    db.query("SELECT * FROM resources", (err, results) => {
        if (err) {
            console.log("Error:", err.message);
            callback();
            return;
        }

        console.table(results);
        callback();
    });
}

function addResource(rl, callback) {
    rl.question("Enter resource name: ", (name) => {
        rl.question("Enter resource type: ", (type) => {
            rl.question("Enter capacity: ", (capacity) => {
                rl.question("Enter location: ", (location) => {

                    const query = `
                        INSERT INTO resources
                        (resource_name, resource_type, capacity, location)
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        query,
                        [name, type, capacity, location],
                        (err) => {
                            if (err) {
                                console.log("Error:", err.message);
                            } else {
                                console.log("Resource added successfully.");
                            }

                            callback();
                        }
                    );
                });
            });
        });
    });
}

function searchResource(rl, callback) {
    rl.question("Enter resource name to search: ", (name) => {

        const query =
            "SELECT * FROM resources WHERE resource_name LIKE ?";

        db.query(query, ["%" + name + "%"], (err, results) => {
            if (err) {
                console.log("Error:", err.message);
            } else {
                console.table(results);
            }

            callback();
        });
    });
}

module.exports = {
    getAllResources,
    addResource,
    searchResource
};