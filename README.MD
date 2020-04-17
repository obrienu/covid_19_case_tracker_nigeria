A Novel Covid 19 recorded cases API for Nigeria. Data are gotten from day to day data release by the NCDC- National Center For Disease Control. 

Routes

GET    /present         Returns total national cases and total cases for each state. State data is sorted 
                        alphabetically

GET    /national        Returns total daily national cases sorted from most recent date to earliest case

GET    /state/:state    Returns the daily cases for a particular state, where :state = name of state. names
                        comprising two words should be written as it is. Example "Akwa Ibom" can be written as Akwa Ibom. the api is case insentitive Data is sorted from most recent to earliest date.  

GET    /region/:region  Returns the daily cases for a particular region, where :region = region. Names should be 
                        written as it is. Example "North East" can be written as North East. the api is case insentitive Data is sorted from most recent to earliest date.   


Filter
Use . to access deep properties

GET /national?data=2020-04-16                   The 'date' query works on both /national and /state/:state routes. it returns data for the 
                                                specified date.
GET /national?from=2020-02-01&to=2020-04-16     The 'from' and 'to' query works on both /national and /state/:state routes. It returns a range
                                                of data from the specified dates. 
GET /national?accumulate=true                   The accumulate query works on both /national and /state/:state routes. It returns the total
                                                cases for the specified period. it works alongside other queries