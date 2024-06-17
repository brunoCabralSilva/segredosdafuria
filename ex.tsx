var tsp1Project = new GlideRecord('tsp1_project');

if (pep_parent) {
    tsp1Project.addQuery('u_capex', costElementPep.getValue('sys_id'));
    tsp1Project.addQuery('u_capex_parent', row[pep_parent]);
    tsp1Project.query();
    if (tsp1Project.next()) tsp1ProjectId = tsp1Project.getValue('sys_id');
    else {
        tsp1Project = new GlideRecord('tsp1_project');
        tsp1Project.addQuery('u_capex', costElementPep.getValue('sys_id'));
        tsp1Project.addNullQuery('u_capex_parent');
        tsp1Project.query();
        if (tsp1Project.next()) tsp1ProjectId = tsp1Project.getValue('sys_id');
    }
} else {
    tsp1Project.addQuery('u_capex', costElementPep.getValue('sys_id'));
    tsp1Project.addNullQuery('u_capex_parent');
    tsp1Project.query();
    if (tsp1Project.next()) tsp1ProjectId = tsp1Project.getValue('sys_id');
}