package com.kubawach.nfs.studio.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kubawach.nfs.core.model.state.Environment;
import com.kubawach.nfs.core.model.system.Concentrations;
import com.kubawach.nfs.core.model.system.System;
import com.kubawach.nfs.core.service.SystemService;

@Service
public class SimulationsService {

	@Autowired private SystemService service;
	
	public List<List<Concentrations>> simulate(List<System> systems, Environment environment) {
		List<List<Concentrations>> simulations = new ArrayList<>(systems.size());
		for (System system : systems) {
			List<Concentrations> concentrations = service.computeConcentration(system, environment);
			simulations.add(concentrations);
		}
		return simulations;
	}
}
