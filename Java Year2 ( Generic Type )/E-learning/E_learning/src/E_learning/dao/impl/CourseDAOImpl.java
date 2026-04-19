package E_learning.dao;

import E_learning.config.Dbconfig;
import E_learning.model.Course;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CourseDAOImpl implements CourseDAO {
    private final Dbconfig dbConfig;

    public CourseDAOImpl() {
        this.dbConfig = Dbconfig.getInstance();
    }

    @Override
    public Course create(Course course) {
        String sql = "INSERT INTO courses (course_name, description, instructor, price, " +
                "duration, level, is_deleted, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING course_id";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, course.getCourseName());
            pstmt.setString(2, course.getDescription());
            pstmt.setString(3, course.getInstructor());
            pstmt.setBigDecimal(4, course.getPrice());
            pstmt.setInt(5, course.getDuration());
            pstmt.setString(6, course.getLevel());
            pstmt.setBoolean(7, course.getIsDeleted());
            pstmt.setTimestamp(8, Timestamp.valueOf().valueOf(course.getCreatedAt()));
            pstmt.setTimestamp(9, Timestamp.valueOf(course.getUpdatedAt()));

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                course.setCourseId(rs.getInt("course_id"));
                return course;
            }
        } catch (SQLException e) {
            System.err.println("Error creating course: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Course getById(Integer id) {
        String sql = "SELECT * FROM courses WHERE course_id = ? AND is_deleted = false";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToCourse(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting course by ID: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean update(Course course) {
        String sql = "UPDATE courses SET course_name = ?, description = ?, instructor = ?, " +
                "price = ?, duration = ?, level = ?, updated_at = ? " +
                "WHERE course_id = ? AND is_deleted = false";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, course.getCourseName());
            pstmt.setString(2, course.getDescription());
            pstmt.setString(3, course.getInstructor());
            pstmt.setBigDecimal(4, course.getPrice());
            pstmt.setInt(5, course.getDuration());
            pstmt.setString(6, course.getLevel());
            pstmt.setTimestamp(7, Timestamp.valueOf(java.time.LocalDateTime.now()));
            pstmt.setInt(8, course.getCourseId());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error updating course: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean delete(Integer id) {
        String sql = "UPDATE courses SET is_deleted = true, updated_at = ? WHERE course_id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setTimestamp(1, Timestamp.valueOf(java.time.LocalDateTime.now()));
            pstmt.setInt(2, id);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error deleting course: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Course> getAllWithPagination(int page, int pageSize) {
        List<Course> courses = new ArrayList<>();
        int offset = (page - 1) * pageSize;

        String sql = "SELECT * FROM courses WHERE is_deleted = false " +
                "ORDER BY created_at DESC LIMIT ? OFFSET ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, pageSize);
            pstmt.setInt(2, offset);

            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                courses.add(mapResultSetToCourse(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting courses with pagination: " + e.getMessage());
            e.printStackTrace();
        }
        return courses;
    }

    @Override
    public int getTotalCount() {
        String sql = "SELECT COUNT(*) as total FROM courses WHERE is_deleted = false";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("total");
            }
        } catch (SQLException e) {
            System.err.println("Error getting total count: " + e.getMessage());
            e.printStackTrace();
        }
        return 0;
    }

    private Course mapResultSetToCourse(ResultSet rs) throws SQLException {
        Course course = new Course();
        course.setCourseId(rs.getInt("course_id"));
        course.setCourseName(rs.getString("course_name"));
        course.setDescription(rs.getString("description"));
        course.setInstructor(rs.getString("instructor"));
        course.setPrice(rs.getBigDecimal("price"));
        course.setDuration(rs.getInt("duration"));
        course.setLevel(rs.getString("level"));
        course.setIsDeleted(rs.getBoolean("is_deleted"));
        course.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        course.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return course;
    }
}

