export class DateFormatter
{
    formatDate(inputDateStr) {
        // Parse the input string into a Date object
        var inputDate = new Date(inputDateStr);
    
        // Months array for conversion
        var months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    
        // Get the month, day, and year
        var month = months[inputDate.getMonth()];
        var day = inputDate.getDate();
        var year = inputDate.getFullYear();
    
        // Get the hours, minutes, and seconds
        var hours = inputDate.getHours();
        var minutes = inputDate.getMinutes();
        var seconds = inputDate.getSeconds();
    
        // Suffix for the day
        var suffix = this.getDaySuffix(day);
    
        // Format the time zone
        var timeZone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(inputDate).find(part => part.type === 'timeZoneName').value;
    
        // Format the date string
        var formattedDate = month + " " + day + suffix + ", " + year + " " + hours + ":" + minutes + ":" + seconds + " " + timeZone;
    
        return formattedDate;
    }
    
    // Function to get the suffix for the day (e.g., "st", "nd", "rd", "th")
    getDaySuffix(day) {
        if (day >= 11 && day <= 13) {
            return "th";
        }
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
}