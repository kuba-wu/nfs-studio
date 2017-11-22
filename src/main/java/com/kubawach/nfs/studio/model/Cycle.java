package com.kubawach.nfs.studio.model;

import java.util.List;

import com.kubawach.nfs.core.model.system.Concentrations;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cycle {

	private List<Concentrations> concentrations;
	private long productsCount;
}
