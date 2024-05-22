import { format } from "date-fns";

// Function to generate formatted date string
const formatDate = (date: Date) => format(date, "MMMM do");

export { formatDate };
