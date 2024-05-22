import { format } from "date-fns";

// Function to generate formatted date string
const formatDate = (date: Date) => format(date, "MMMM do");

const formatTime = (date: string): string => {
  return format(date, "hh:mm aa");
};

export { formatDate, formatTime };
