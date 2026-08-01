const db = require("../config/db");
const validation = require("../utils/validation");


// Check resource availability
function checkAvailability(resourceId, date, startTime, endTime, callback) {

    const query = `
        SELECT *
        FROM bookings
        WHERE resource_id = ?
        AND booking_date = ?
        AND (
            start_time < ?
            AND end_time > ?
        )
    `;

    db.query(
        query,
        [resourceId, date, endTime, startTime],
        (err, results) => {

            if (err) {
                callback(err, false);
                return;
            }

            if (results.length > 0) {
                callback(null, false);
            } else {
                callback(null, true);
            }

        }
    );
}


// Create booking
function bookResource(rl, callback) {

    rl.question("Enter student ID: ", (studentId) => {

        rl.question("Enter resource ID: ", (resourceId) => {

            rl.question("Enter booking date (YYYY-MM-DD): ", (date) => {

                rl.question("Enter start time (HH:MM:SS): ", (startTime) => {

                    rl.question("Enter end time (HH:MM:SS): ", (endTime) => {


                        if (!validation.isPositiveNumber(studentId)) {
                            console.log("Invalid student ID.");
                            callback();
                            return;
                        }


                        if (!validation.isPositiveNumber(resourceId)) {
                            console.log("Invalid resource ID.");
                            callback();
                            return;
                        }


                        if (!validation.isValidDate(date)) {
                            console.log("Invalid date format.");
                            callback();
                            return;
                        }


                        if (!validation.isValidTime(startTime)) {
                            console.log("Invalid start time format.");
                            callback();
                            return;
                        }


                        if (!validation.isValidTime(endTime)) {
                            console.log("Invalid end time format.");
                            callback();
                            return;
                        }


                        checkAvailability(
                            resourceId,
                            date,
                            startTime,
                            endTime,
                            (err, available) => {


                                if (err) {
                                    console.log("Error:", err.message);
                                    callback();
                                    return;
                                }


                                if (!available) {
                                    console.log(
                                        "Resource already booked for this time."
                                    );
                                    callback();
                                    return;
                                }


                                const query = `
                                    INSERT INTO bookings
                                    (
                                        user_id,
                                        resource_id,
                                        booking_date,
                                        start_time,
                                        end_time
                                    )
                                    VALUES (?, ?, ?, ?, ?)
                                `;


                                db.query(
                                    query,
                                    [
                                        studentId,
                                        resourceId,
                                        date,
                                        startTime,
                                        endTime
                                    ],
                                    (err) => {

                                        if (err) {
                                            console.log(
                                                "Booking failed:",
                                                err.message
                                            );
                                        } else {
                                            console.log(
                                                "Booking created successfully."
                                            );
                                        }

                                        callback();

                                    }
                                );


                            }
                        );


                    });

                });

            });

        });

    });

}


// View booking history
function viewBookingHistory(callback) {

    const query = `
        SELECT
            b.booking_id,
            u.student_name,
            r.resource_name,
            b.booking_date,
            b.start_time,
            b.end_time
        FROM bookings b
        INNER JOIN users u
        ON b.user_id = u.user_id
        INNER JOIN resources r
        ON b.resource_id = r.resource_id
        ORDER BY b.booking_date DESC
    `;


    db.query(query, (err, results) => {


        if (err) {
            console.log("Error:", err.message);
            callback();
            return;
        }


        if (results.length === 0) {

            console.log("No booking history found.");

        } else {

            console.table(results);

        }


        callback();


    });

}


// Cancel booking
function cancelBooking(rl, callback) {

    rl.question("Enter booking ID to cancel: ", (bookingId) => {


        const query = `
            DELETE FROM bookings
            WHERE booking_id = ?
        `;


        db.query(
            query,
            [bookingId],
            (err, result) => {


                if (err) {

                    console.log("Error:", err.message);
                    callback();
                    return;

                }


                if (result.affectedRows === 0) {

                    console.log("Booking not found.");

                } else {

                    console.log(
                        "Booking cancelled successfully."
                    );

                }


                callback();


            }
        );


    });

}


// Update booking
function updateBooking(rl, callback) {


    rl.question("Enter booking ID: ", (bookingId) => {


        rl.question(
            "Enter new booking date (YYYY-MM-DD): ",
            (date) => {


                rl.question(
                    "Enter new start time (HH:MM:SS): ",
                    (startTime) => {


                        rl.question(
                            "Enter new end time (HH:MM:SS): ",
                            (endTime) => {


                                if (!validation.isValidDate(date)) {

                                    console.log(
                                        "Invalid date format."
                                    );

                                    callback();
                                    return;

                                }


                                if (!validation.isValidTime(startTime)) {

                                    console.log(
                                        "Invalid start time format."
                                    );

                                    callback();
                                    return;

                                }


                                if (!validation.isValidTime(endTime)) {

                                    console.log(
                                        "Invalid end time format."
                                    );

                                    callback();
                                    return;

                                }


                                const query = `
                                    UPDATE bookings
                                    SET
                                        booking_date = ?,
                                        start_time = ?,
                                        end_time = ?
                                    WHERE booking_id = ?
                                `;


                                db.query(
                                    query,
                                    [
                                        date,
                                        startTime,
                                        endTime,
                                        bookingId
                                    ],
                                    (err, result) => {


                                        if (err) {

                                            console.log(
                                                "Error:",
                                                err.message
                                            );


                                        } else if (
                                            result.affectedRows === 0
                                        ) {

                                            console.log(
                                                "Booking not found."
                                            );


                                        } else {

                                            console.log(
                                                "Booking updated successfully."
                                            );

                                        }


                                        callback();


                                    }
                                );


                            }
                        );


                    }
                );


            }
        );


    });

}



module.exports = {
    bookResource,
    viewBookingHistory,
    cancelBooking,
    updateBooking,
    checkAvailability
};