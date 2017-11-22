package com.kubawach.nfs.studio.model;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

import com.kubawach.nfs.core.model.state.Environment;
import com.kubawach.nfs.core.model.system.System;

@Data
@NoArgsConstructor
public class SystemComparison {

	private Environment environment;
    private List<System> systems;
}
