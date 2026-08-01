const readline = require("readline");
const resourceService = require("./services/resourceService");
const bookingService = require("./services/bookingService");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\\n==============================");
    console.log(" Campus Resource Booking System");
    console.log("==============================");
    console.log("1. View All Resources");
    console.log("2. Add New Resource");
    console.log("3. Search Resource");
    console.log("4. Book Resource");
    console.log("5. View Booking History");
    console.log("6. Cancel Booking");
    console.log("7. Update Booking");
    console.log("8. Exit");

    rl.question("\\nEnter your choice: ", (choice) => {
        switch (choice) {
            case "1":
                resourceService.getAllResources(showMenu);
                break;

            case "2":
                resourceService.addResource(rl, showMenu);
                break;

            case "3":
                resourceService.searchResource(rl, showMenu);
                break;

            case "4":
                bookingService.bookResource(rl, showMenu);
                break;

            case "5":
                bookingService.viewBookingHistory(showMenu);
                break;

            case "6":
                bookingService.cancelBooking(rl, showMenu);
                break;

            case "7":
                bookingService.updateBooking(rl, showMenu);
                break;

            case "8":
                console.log("Application closed.");
                rl.close();
                break;

            default:
                console.log("Invalid choice. Try again.");
                showMenu();
        }
    });
}

showMenu();