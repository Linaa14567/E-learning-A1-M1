package co.istad.elearninga01m1.features.video;

import co.istad.elearninga01m1.features.course.Course;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "videos")
public class Video {
    @Id
    private Integer id;
    private String slug;
    private String title;
    private String thumbnail;
    private String duration;
    private String youtube;
    private Boolean isPublished;
    private Boolean isDeleted;

    @ManyToOne
    private Course course;
}
