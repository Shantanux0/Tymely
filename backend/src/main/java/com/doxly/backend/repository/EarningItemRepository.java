package com.doxly.backend.repository;

import com.doxly.backend.model.EarningItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EarningItemRepository extends JpaRepository<EarningItem, String> {
}
