package com.kubawach.nfs.studio.service;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Arrays;
import java.util.List;

import org.fest.assertions.Condition;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.kubawach.nfs.core.model.system.Concentration;
import com.kubawach.nfs.core.model.system.Concentrations;
import com.kubawach.nfs.studio.model.Cycle;

public class CycleServiceTestCase {

	private CycleService underTest;
	
	@Before
	public void setUp() {
		underTest = new CycleService();
	}
	
	private Concentration val(double value) {
		return new Concentration(0, value);
	}
	
	@Test
	@Ignore
	public void shouldFindCycleForOneSystemSimpleCaseOneProduct() throws Exception {
		// given 
		List<Concentration> values = Arrays.asList(
			val(1), val(2), val(3), val(4), val(3), val(2), val(1), val(2), val(3), val(4), val(3), val(2), val(1), val(2)
				);
		Concentrations concentration = new Concentrations("first", values);
		List<Concentrations> concentrations = Arrays.asList(concentration);

		// when
		List<Cycle> cycles = underTest.findCycles(Arrays.asList(concentrations));

		// then
		assertThat(cycles).hasSize(1);
		Cycle cycle = cycles.get(0);
		assertThat(cycle.getConcentrations()).hasSize(1);
		assertThat(cycle.getConcentrations().get(0).getValues()).is(concentrations(1.0, 2.0, 3.0, 4.0, 3.0, 2.0));
	}
	
	@Test
	@Ignore
	public void shouldFindCycleForOneSystemSimpleCaseTwoProducts() throws Exception {
		// given 	
		Concentrations first = new Concentrations("first", Arrays.asList(
			val(1), val(2), val(3), val(2), val(1), val(2), val(3), val(2), val(1), val(2), val(3), val(2), val(1), val(2), val(3), val(2)));
		Concentrations second = new Concentrations("second", Arrays.asList(
			val(1), val(2), val(3), val(4), val(5), val(4), val(3), val(2), val(1), val(2), val(3), val(4), val(5), val(4), val(3), val(2)));
		List<Concentrations> concentrations = Arrays.asList(first, second);

		// when
		List<Cycle> cycles = underTest.findCycles(Arrays.asList(concentrations));

		// then
		assertThat(cycles).hasSize(1);
		Cycle cycle = cycles.get(0);
		assertThat(cycle.getConcentrations()).hasSize(2);
		assertThat(cycle.getConcentrations().get(0).getValues()).is(concentrations(1, 2, 3, 2, 1));
		assertThat(cycle.getConcentrations().get(1).getValues()).is(concentrations(1, 2, 3, 4, 5, 4, 3, 2));
	}	
	
	private Condition<List<?>> concentrations(final double... expected) {
		return new Condition<List<?>>() {
			@Override public boolean matches(List<?> value) {
				List<Concentration> values = (List<Concentration>)value;
				for (int i=0, n=expected.length; i < n; i++) {
					if (expected[i] != values.get(i).getProduct()) {
						return false;
					}
				}
				return true;
			}
		};		
	}
}
