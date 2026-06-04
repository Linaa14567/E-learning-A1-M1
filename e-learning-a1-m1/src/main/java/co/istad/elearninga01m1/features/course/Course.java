package co.istad.elearninga01m1.features.course;


import co.istad.elearninga01m1.features.category.Category;
import co.istad.elearninga01m1.features.video.Video;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String slug;
    private String keyword;
    private String title;
    private String description;
    private String thumbnail;
    private Float starRating;
    private Integer ratingCount;
    private Float totalHours;
    private String levels;
    private BigDecimal price;
    private Float discountPercent;
    private LocalDate createdDate;
    private LocalDate updatedAt;

    @ManyToOne
    private Category category;

    private Boolean isDelete;
    private Boolean isPublished;

    @OneToMany(mappedBy = "course")
    private List<Video> videos;
}