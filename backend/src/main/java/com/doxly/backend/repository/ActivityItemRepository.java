package com.doxly.backend.repository;

import com.doxly.backend.model.ActivityItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityItemRepository extends JpaRepository<ActivityItem, String> {
    List<ActivityItem> findTop50ByOrderByTimestampDesc();
}
