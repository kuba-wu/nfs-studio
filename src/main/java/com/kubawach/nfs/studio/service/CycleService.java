package com.kubawach.nfs.studio.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.kubawach.nfs.core.model.system.Concentration;
import com.kubawach.nfs.core.model.system.Concentrations;
import com.kubawach.nfs.studio.model.Cycle;

@Service
public class CycleService {
	
	private static final Logger log = LoggerFactory.getLogger(CycleService.class);
	private static final double EPSILON = 0.1;
	private static final int MINIMAL_CYCLE_LENGTH = 10;

	public List<Cycle> findCycles(List<List<Concentrations>> simulations) {
		
		List<Cycle> result = new ArrayList<>(simulations.size());
		for (List<Concentrations> simulation : simulations) {
		    result.add(new Cycle(findCycle(simulation), simulation.size()));
		}
		return result;
	}
	
	private List<Concentrations> findCycle(List<Concentrations> concentrations) {
		
		int length = concentrations.get(0).getValues().size();
		log.info("Searching for cycle on data length: {}", length);
		
		for (int i=0; i < length-MINIMAL_CYCLE_LENGTH; i++) {
		    double[] reference = getPoint(concentrations, i);
			
		    int equalIndex = findEqualIndex(concentrations, i+MINIMAL_CYCLE_LENGTH, length, i, reference);
			int cycleLength = equalIndex-i;

			// is there a capacity for at least second cycle? 
			while ((equalIndex != -1) && (equalIndex + cycleLength <= length)) {
				boolean match = checkIfCycleMatches(concentrations, i, equalIndex, cycleLength);
				if (match) {
				    log.debug("Found cycle between {} and {}, cycle length: {}", i, equalIndex, cycleLength);
					return subList(concentrations, i, equalIndex);
				}
				// next equal search
				equalIndex = findEqualIndex(concentrations, equalIndex+1, length, i, reference);
				cycleLength = equalIndex-i;
			}
			log.debug("Finished search for index:{}, last equal: {}", i, equalIndex);
		}
		log.warn("Could not find a cycle!");
		return Collections.emptyList();
	}

	private boolean checkIfCycleMatches(List<Concentrations> concentrations, int firstCycleStart, int secondCycleStart, int cycleLength) {

		for (int k=1; k < cycleLength; k++) {
			double[] first = getPoint(concentrations, firstCycleStart+k);
			double[] second = getPoint(concentrations, secondCycleStart+k);
			if (!equals(first, second)) {
				log.debug("Broke search on: {}, idx: {} and: {}, idx: {}", first, firstCycleStart+k, second, secondCycleStart+k);	
				return false;
			}
		}
		return true;
	}
	
	private List<Concentrations> subList(List<Concentrations> concentrations, int start, int end) {
		List<Concentrations> result = new ArrayList<>(end-start);
		for (Concentrations concentration : concentrations) {
			List<Concentration> concentrationList = concentration.getValues().subList(start, end);
			result.add(new Concentrations(concentration.getProduct(), concentrationList));
		}
		return result;
	}
	
	private int findEqualIndex(List<Concentrations> concentrations, int start, int length, int referenceIdx, double[] reference) {
		for (int i=start; i < length; i++) {
		    double[] point = getPoint(concentrations, i);
			if (equals(point, reference)) {
				log.debug("Equal idx: {}, point: {} reference idx: {}, point: {}", i, point, referenceIdx, reference);
				return i;
			}
		}
		return -1;
	}
	
	private boolean equals(double[] one, double[] two) {
		for (int i=0, n=one.length; i < n; i++) {
			if (Math.abs(one[i] - two[i]) > EPSILON) {
				return false;
			}
		}
		return true;
	}
	
	private double[] getPoint(List<Concentrations> concentrations, int index) {
	    double[] point = new double[concentrations.size()]; 
		for (int i=0, n=concentrations.size(); i < n; i++) {
			point[i] = concentrations.get(i).getValues().get(index).getProduct();
		}
		return point;
	}
}
