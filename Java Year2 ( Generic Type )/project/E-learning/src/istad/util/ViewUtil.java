package istad.view;

//package co.istad.jdbc.view;

import co.istad.jdbc.model.Course;
import co.istad.jdbc.model.Enrollment;
import istad.model.Course;

import java.util.List;

public class ViewUtil {

    private ViewUtil() {}

    // ── shared ──────────────────────────────────────────────────────
    public static void printHeader(String title) {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.printf( "║  %-62s║%n", title);
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
    }

    private static void printLine() {
        System.out.println("──────────────────────────────────────────────────────────────────────────────────");
    }

    // ── main menu ───────────────────────────────────────────────────
    public static void printMenu() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.println("║        📚  COURSE ENROLLMENT MANAGEMENT SYSTEM              ║");
        System.out.println("╠══════════════════════════════════════════════════════════════╣");
        System.out.println("║                                                              ║");
        System.out.println("║   ─── Course Management ───                                  ║");
        System.out.println("║   1. List all courses (paginated)                            ║");
        System.out.println("║   2. Add a new course                                        ║");
        System.out.println("║   3. Update a course                                         ║");
        System.out.println("║   4. Delete a course  (soft)                                 ║");
        System.out.println("║                                                              ║");
        System.out.println("║   ─── Enrollment Management ───                              ║");
        System.out.println("║   5. Enroll in a course                                      ║");
        System.out.println("║   6. Search enrollments                                      ║");
        System.out.println("║   7. Pay enrollment                                          ║");
        System.out.println("║                                                              ║");
        System.out.println("║   0. Exit                                                    ║");
        System.out.println("║                                                              ║");
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
    }

    // ── course table (5 visible columns: ID, Name, Instructor, Price, Level) ──
    public static void printCourseList(List<Course> courses, int page, int totalPage) {
        System.out.println();
        printLine();
        System.out.printf("  📖  Course List   —  Page %d / %d%n", page, totalPage);
        printLine();
        System.out.printf("  %-5s %-28s %-18s %-12s %s%n",
                "ID", "Course Name", "Instructor", "Price", "Level");
        printLine();

        if (courses.isEmpty()) {
            System.out.println("  (no courses found)");
        } else {
            for (Course c : courses) {
                System.out.printf("  %-5d %-28s %-18s $%-11s %s%n",
                        c.getCourseId(),
                        truncate(c.getCourseName(), 27),
                        truncate(c.getInstructor(), 17),
                        c.getPrice().toPlainString(),
                        c.getLevel());
            }
        }
        printLine();
    }

    // ── pagination hint ─────────────────────────────────────────────
    public static void printPaginationHint(int page, int totalPage) {
        System.out.print("  [P]rev  [N]ext  or enter page number (current: " + page + "/" + totalPage + "): ");
    }

    // ── enrollment table ────────────────────────────────────────────
    public static void printEnrollmentList(List<Enrollment> enrollments) {
        System.out.println();
        printLine();
        System.out.println("  📋  Enrollment Results");
        printLine();
        System.out.printf("  %-6s %-8s %-22s %-28s %-14s %s%n",
                "ID", "CrsID", "Student Name", "Email", "Method", "Status");
        printLine();

        if (enrollments.isEmpty()) {
            System.out.println("  (no enrollments found)");
        } else {
            for (Enrollment e : enrollments) {
                System.out.printf("  %-6d %-8d %-22s %-28s %-14s %s%n",
                        e.getEnrollmentId(),
                        e.getCourseId(),
                        truncate(e.getStudentName(), 21),
                        truncate(e.getEmail(), 27),
                        e.getPaymentMethod(),
                        e.getPaymentStatus());
            }
        }
        printLine();
    }

    // ── single enrollment detail (shown before Pay) ────────────────
    public static void printEnrollmentDetail(Enrollment e) {
        System.out.println();
        printLine();
        System.out.println("  💳  Enrollment Detail");
        printLine();
        System.out.println("    Enrollment ID   : " + e.getEnrollmentId());
        System.out.println("    Course ID       : " + e.getCourseId());
        System.out.println("    Student Name    : " + e.getStudentName());
        System.out.println("    Email           : " + e.getEmail());
        System.out.println("    Enroll Date     : " + e.getEnrollDate());
        System.out.println("    Payment Method  : " + e.getPaymentMethod());
        System.out.println("    Payment Status  : " + e.getPaymentStatus());
        printLine();
    }

    // ── helper ──────────────────────────────────────────────────────
    private static String truncate(String s, int max) {
        if (s == null)          return "";
        if (s.length() <= max)  return s;
        return s.substring(0, max - 2) + "..";
    }
}
