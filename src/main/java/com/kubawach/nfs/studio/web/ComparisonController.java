package com.kubawach.nfs.studio.web;


import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kubawach.nfs.core.model.system.Concentrations;
import com.kubawach.nfs.core.web.SystemNotSetException;
import com.kubawach.nfs.studio.model.ComparisonResult;
import com.kubawach.nfs.studio.model.Cycle;
import com.kubawach.nfs.studio.model.SystemComparison;
import com.kubawach.nfs.studio.service.CycleService;
import com.kubawach.nfs.studio.service.SimulationsService;

@Controller
@RequestMapping("system")
public class ComparisonController {

    private static final Logger logger = Logger.getLogger(ComparisonController.class);

    @Autowired private CycleService cycleService;
    @Autowired private SimulationsService simluationsService;
    
    @RequestMapping(value="compare", method=RequestMethod.POST)
    @ResponseBody
    public ComparisonResult compare(@RequestBody final SystemComparison systems) {

        logger.info("Comparing systems environment: "+systems.getEnvironment());
        if ((systems.getSystems() == null) || systems.getSystems().isEmpty()) {
            logger.error("At least one system is needed for comparison.");
            throw new SystemNotSetException();
        }
        
        List<List<Concentrations>> simulations = simluationsService.simulate(systems.getSystems(), systems.getEnvironment());
        List<Cycle> cycles = cycleService.findCycles(simulations);
        return new ComparisonResult(cycles, simulations);
    } 
}
