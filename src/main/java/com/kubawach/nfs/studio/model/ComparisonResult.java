package com.kubawach.nfs.studio.model;

import java.util.List;

import com.kubawach.nfs.core.model.system.Concentrations;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonResult {

	private List<Cycle> cycles;
	private List<List<Concentrations>> simulations;
}
