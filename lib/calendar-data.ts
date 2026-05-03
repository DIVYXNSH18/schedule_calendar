import type { CalendarEventItem, CalendarFilter } from "@/components/calendar/types";
import { addDays, dateKey, startOfWeek } from "@/lib/date-utils";

export const calendarFilters: CalendarFilter[] = [
  {
    id: "science",
    label: "Science",
    accentClass: "accent-blue-600",
    checked: true,
    tone: "blue",
  },
  {
    id: "humanities",
    label: "Humanities",
    accentClass: "accent-teal-600",
    checked: true,
    tone: "teal",
  },
  {
    id: "maths",
    label: "Mathematics",
    accentClass: "accent-violet-600",
    checked: true,
    tone: "violet",
  },
  {
    id: "arts",
    label: "Arts & PE",
    accentClass: "accent-amber-500",
    checked: true,
    tone: "amber",
  },
  {
    id: "language",
    label: "Language",
    accentClass: "accent-rose-500",
    checked: true,
    tone: "rose",
  },
];

export const timeLabels = [
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

// Weekly class template — day 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
const WEEKLY_TEMPLATE = [
  // MONDAY
  { day: 1, id: "mon-1", title: "Mathematics",       subject: "Mathematics",      teacher: "Mr. Arjun Sharma",  start: 8*60,       end: 9*60,       calendarId: "maths",      tone: "violet", location: "Room 101" },
  { day: 1, id: "mon-2", title: "Physics",            subject: "Physics",          teacher: "Ms. Priya Nair",   start: 9*60+15,    end: 10*60+15,   calendarId: "science",    tone: "blue",   location: "Lab 2" },
  { day: 1, id: "mon-3", title: "English Literature", subject: "English",          teacher: "Mrs. Sunita Verma",start: 11*60,      end: 12*60,      calendarId: "language",   tone: "rose",   location: "Room 204" },
  { day: 1, id: "mon-4", title: "History",            subject: "History",          teacher: "Mr. Ravi Kulkarni",start: 13*60,      end: 14*60,      calendarId: "humanities", tone: "teal",   location: "Room 305" },
  { day: 1, id: "mon-5", title: "Physical Education", subject: "PE",               teacher: "Mr. Deepak Singh", start: 15*60,      end: 16*60,      calendarId: "arts",       tone: "amber",  location: "Sports Ground" },
  // TUESDAY
  { day: 2, id: "tue-1", title: "Chemistry",          subject: "Chemistry",        teacher: "Ms. Anita Desai",  start: 8*60,       end: 9*60,       calendarId: "science",    tone: "blue",   location: "Lab 1" },
  { day: 2, id: "tue-2", title: "Mathematics",        subject: "Mathematics",      teacher: "Mr. Arjun Sharma",  start: 9*60+15,    end: 10*60+15,   calendarId: "maths",      tone: "violet", location: "Room 101" },
  { day: 2, id: "tue-3", title: "Geography",          subject: "Geography",        teacher: "Mrs. Kavita Joshi",start: 11*60,      end: 12*60,      calendarId: "humanities", tone: "teal",   location: "Room 202" },
  { day: 2, id: "tue-4", title: "Hindi",              subject: "Hindi",            teacher: "Mr. Suresh Pandey",start: 13*60,      end: 14*60,      calendarId: "language",   tone: "rose",   location: "Room 108" },
  { day: 2, id: "tue-5", title: "Art & Craft",        subject: "Art",              teacher: "Ms. Meera Pillai", start: 14*60+30,   end: 15*60+30,   calendarId: "arts",       tone: "amber",  location: "Art Room" },
  // WEDNESDAY
  { day: 3, id: "wed-1", title: "Biology",            subject: "Biology",          teacher: "Dr. Neha Gupta",   start: 8*60,       end: 9*60,       calendarId: "science",    tone: "blue",   location: "Lab 3" },
  { day: 3, id: "wed-2", title: "English Literature", subject: "English",          teacher: "Mrs. Sunita Verma",start: 9*60+15,    end: 10*60+15,   calendarId: "language",   tone: "rose",   location: "Room 204" },
  { day: 3, id: "wed-3", title: "Mathematics",        subject: "Mathematics",      teacher: "Mr. Arjun Sharma",  start: 11*60,      end: 12*60,      calendarId: "maths",      tone: "violet", location: "Room 101" },
  { day: 3, id: "wed-4", title: "Computer Science",   subject: "Computer Science", teacher: "Mr. Vikram Rao",   start: 13*60,      end: 14*60+30,   calendarId: "science",    tone: "blue",   location: "Computer Lab" },
  // THURSDAY
  { day: 4, id: "thu-1", title: "Physics",            subject: "Physics",          teacher: "Ms. Priya Nair",   start: 8*60,       end: 9*60,       calendarId: "science",    tone: "blue",   location: "Lab 2" },
  { day: 4, id: "thu-2", title: "History",            subject: "History",          teacher: "Mr. Ravi Kulkarni",start: 9*60+15,    end: 10*60+15,   calendarId: "humanities", tone: "teal",   location: "Room 305" },
  { day: 4, id: "thu-3", title: "Chemistry",          subject: "Chemistry",        teacher: "Ms. Anita Desai",  start: 11*60,      end: 12*60,      calendarId: "science",    tone: "blue",   location: "Lab 1" },
  { day: 4, id: "thu-4", title: "Hindi",              subject: "Hindi",            teacher: "Mr. Suresh Pandey",start: 13*60,      end: 14*60,      calendarId: "language",   tone: "rose",   location: "Room 108" },
  { day: 4, id: "thu-5", title: "Physical Education", subject: "PE",               teacher: "Mr. Deepak Singh", start: 15*60,      end: 16*60,      calendarId: "arts",       tone: "amber",  location: "Sports Ground" },
  // FRIDAY
  { day: 5, id: "fri-1", title: "Biology",            subject: "Biology",          teacher: "Dr. Neha Gupta",   start: 8*60,       end: 9*60,       calendarId: "science",    tone: "blue",   location: "Lab 3" },
  { day: 5, id: "fri-2", title: "Geography",          subject: "Geography",        teacher: "Mrs. Kavita Joshi",start: 9*60+15,    end: 10*60+15,   calendarId: "humanities", tone: "teal",   location: "Room 202" },
  { day: 5, id: "fri-3", title: "Computer Science",   subject: "Computer Science", teacher: "Mr. Vikram Rao",   start: 11*60,      end: 12*60+30,   calendarId: "science",    tone: "blue",   location: "Computer Lab" },
  { day: 5, id: "fri-4", title: "Art & Craft",        subject: "Art",              teacher: "Ms. Meera Pillai", start: 13*60,      end: 14*60,      calendarId: "arts",       tone: "amber",  location: "Art Room" },
  { day: 5, id: "fri-5", title: "Mathematics",        subject: "Mathematics",      teacher: "Mr. Arjun Sharma",  start: 14*60+30,   end: 15*60+30,   calendarId: "maths",      tone: "violet", location: "Room 101" },
] as const;

// Generate events for N weeks around the anchor date
export function createInitialEvents(anchorDate: Date): CalendarEventItem[] {
  const events: CalendarEventItem[] = [];
  // Generate 12 weeks back and 12 weeks forward
  for (let w = -12; w <= 12; w++) {
    const weekStart = startOfWeek(addDays(anchorDate, w * 7));
    for (const cls of WEEKLY_TEMPLATE) {
      const day = addDays(weekStart, cls.day);
      const dk = dateKey(day);
      events.push({
        id: `cls-w${w}-${cls.id}`,
        title: cls.title,
        subject: cls.subject,
        teacher: cls.teacher,
        date: dk,
        startMinutes: cls.start,
        endMinutes: cls.end,
        allDay: false,
        calendarId: cls.calendarId,
        tone: cls.tone as CalendarEventItem["tone"],
        type: "event",
        location: cls.location,
      });
    }
  }
  return events;
}
