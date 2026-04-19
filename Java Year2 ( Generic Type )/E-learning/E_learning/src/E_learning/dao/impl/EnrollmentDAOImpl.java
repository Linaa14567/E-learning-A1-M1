package E_learning.dao;
//
//import E_learning.config.DbConfig;
//import dao.EnrollmentDAO;
//import config.DbConfig;
//import model.Enrollment;

import E_learning.config.Dbconfig;
import E_learning.model.Enrollment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EnrollmentDAOImpl implements EnrollmentDAO {
    private final Dbconfig dbConfig;

    public EnrollmentDAOImpl() {
        this.dbConfig = Dbconfig.getInstance();
    }

    @Override
    public Enrollment create(Enrollment enrollment) {
        String sql = "INSERT INTO enrollments (course_id, student_name, email, enroll_date, " +
                "payment_method, payment_status, is_deleted, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING enrollment_id";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, enrollment.getCourseId());
            pstmt.setString(2, enrollment.getStudentName());
            pstmt.setString(3, enrollment.getEmail());
            pstmt.setDate(4, Date.valueOf(enrollment.getEnrollDate()));
            pstmt.setString(5, enrollment.getPaymentMethod());
            pstmt.setString(6, enrollment.getPaymentStatus());
            pstmt.setBoolean(7, enrollment.getIsDeleted());
            pstmt.setTimestamp(8, Timestamp.valueOf(enrollment.getCreatedAt()));
            pstmt.setTimestamp(9, Timestamp.valueOf(enrollment.getUpdatedAt()));

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                enrollment.setEnrollmentId(rs.getInt("enrollment_id"));
                return enrollment;
            }
        } catch (SQLException e) {
            System.err.println("Error creating enrollment: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Enrollment getById(Integer id) {
        String sql = "SELECT e.*, c.course_name " +
                "FROM enrollments e " +
                "LEFT JOIN courses c ON e.course_id = c.course_id " +
                "WHERE e.enrollment_id = ? AND e.is_deleted = false";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToEnrollment(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting enrollment by ID: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean updatePaymentStatus(Integer enrollmentId, String paymentStatus) {
        String sql = "UPDATE enrollments SET payment_status = ?, updated_at = ? " +
                "WHERE enrollment_id = ? AND is_deleted = false";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, paymentStatus);
            pstmt.setTimestamp(2, Timestamp.valueOf(java.time.LocalDateTime.now()));
            pstmt.setInt(3, enrollmentId);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error updating payment status: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Enrollment> searchByCourseId(Integer courseId) {
        List<Enrollment> enrollments = new ArrayList<>();
        String sql = "SELECT e.*, c.course_name " +
                "FROM enrollments e " +
                "LEFT JOIN courses c ON e.course_id = c.course_id " +
                "WHERE e.course_id = ? AND e.is_deleted = false " +
                "ORDER BY e.enroll_date DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, courseId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                enrollments.add(mapResultSetToEnrollment(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error searching enrollments by course ID: " + e.getMessage());
            e.printStackTrace();
        }
        return enrollments;
    }

    @Override
    public List<Enrollment> searchByStudentName(String studentName) {
        List<Enrollment> enrollments = new ArrayList<>();
        String sql = "SELECT e.*, c.course_name " +
                "FROM enrollments e " +
                "LEFT JOIN courses c ON e.course_id = c.course_id " +
                "WHERE LOWER(e.student_name) LIKE LOWER(?) AND e.is_deleted = false " +
                "ORDER BY e.enroll_date DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, "%" + studentName + "%");
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                enrollments.add(mapResultSetToEnrollment(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error searching enrollments by student name: " + e.getMessage());
            e.printStackTrace();
        }
        return enrollments;
    }

    @Override
    public List<Enrollment> searchByPaymentStatus(String paymentStatus) {
        List<Enrollment> enrollments = new ArrayList<>();
        String sql = "SELECT e.*, c.course_name " +
                "FROM enrollments e " +
                "LEFT JOIN courses c ON e.course_id = c.course_id " +
                "WHERE e.payment_status = ? AND e.is_deleted = false " +
                "ORDER BY e.enroll_date DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, paymentStatus);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                enrollments.add(mapResultSetToEnrollment(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error searching enrollments by payment status: " + e.getMessage());
            e.printStackTrace();
        }
        return enrollments;
    }

    @Override
    public List<Enrollment> getAll() {
        List<Enrollment> enrollments = new ArrayList<>();
        String sql = "SELECT e.*, c.course_name " +
                "FROM enrollments e " +
                "LEFT JOIN courses c ON e.course_id = c.course_id " +
                "WHERE e.is_deleted = false " +
                "ORDER BY e.enroll_date DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                enrollments.add(mapResultSetToEnrollment(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting all enrollments: " + e.getMessage());
            e.printStackTrace();
        }
        return enrollments;
    }

    private Enrollment mapResultSetToEnrollment(ResultSet rs) throws SQLException {
        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentId(rs.getInt("enrollment_id"));
        enrollment.setCourseId(rs.getInt("course_id"));
        enrollment.setStudentName(rs.getString("student_name"));
        enrollment.setEmail(rs.getString("email"));
        enrollment.setEnrollDate(rs.getDate("enroll_date").toLocalDate());
        enrollment.setPaymentMethod(rs.getString("payment_method"));
        enrollment.setPaymentStatus(rs.getString("payment_status"));
        enrollment.setIsDeleted(rs.getBoolean("is_deleted"));
        enrollment.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        enrollment.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        // Set course name if available from join
        String courseName = rs.getString("course_name");
        if (courseName != null) {
            enrollment.setCourseName(courseName);
        }

        return enrollment;
    }
}
