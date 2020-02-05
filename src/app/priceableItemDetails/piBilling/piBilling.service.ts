import { Injectable } from '@angular/core';
import { cycleConfigurationData } from '../../../assets/priceableItemCycleConfiguration';
import { ajaxUtilService } from '../../helpers/ajaxUtil.service';
import { Http, Response } from '@angular/http';

@Injectable()

export class PiBillingService {

  USAGECYCLEID = 'usageCycleId';
  CYCLEMODE = 'cycleMode';
  CYCLETYPEID = 'cycleTypeId';
  SEMIMONTHLY = 'SEMI_MONTHLY';
  FIXEDCYCLEKEYS = {
    DAYS_OF_MONTH: 'dayOfMonth',
    DAYS_OF_WEEK: 'dayOfWeek',
    FIRST_DAY_OF_MONTH: 'firstDayOfMonth',
    SECOND_DAY_OF_MONTH: 'secondDayOfMonth',
    START_MONTH: 'startMonth',
    START_DAY: 'startDay',
    START_YEAR: 'startYear',
    BI_WEEKLY: 'startDay'
  };
  biWeeklyData = {};
  constructor(private readonly _http: Http, private readonly _ajaxUtil: ajaxUtilService) { }

  getRecCycles() {
    return {
      0: {
        attr: this.CYCLEMODE,
        key: 'BCR_CONSTRAINED',
        text: 'TEXT_SAMEAS_SUBSCRIBERSPAYEES_BILLINGCYCLE_REQUIRED_TO_BE',
        child: {
          0: {
            text: 'TEXT_ELLIGIBLE_CYCLE',
            value: this.getInterVals()
          }
        }
      },
      1: {
        attr: this.CYCLEMODE,
        key: 'EBCR',
        text: 'TEXT_ALIGNEDTO_SUBSCRIBERS_PAYERS_BILLINGCYCLE_OCCURING',
        child: {
          0: {
            text: 'TEXT_CHANGE_FREQUENCY',
            value: this.getEbcrInterVals()
          }
        }
      },
      2: {
        attr: this.CYCLEMODE,
        key: 'ALIGNED_TO_DATE',
        text: 'TEXT_ALIGNEDTO_PAYEES_RECURRINGCHARGE_ALIGNMENTDATE_OCCURING',
        child: {
          0: {
            text: 'TEXT_CHANGE_FREQUENCY',
            value: this.getInterVals()
          }
        }
      },
    };
  }

  getInterVals() {
    return {
      0: {
        attr: this.CYCLETYPEID,
        key: 'MONTHLY',
        text: 'TEXT_MONTHLY',
        child: {
          0: {
            attr: this.FIXEDCYCLEKEYS.DAYS_OF_MONTH,
            text: 'TEXT_END_DAY',
            type: 'daysInMonth',
            value: ''
          }
        }
      },
      1: {
        attr: this.CYCLETYPEID,
        key: 'DAILY',
        text: 'TEXT_DAILY',
        child: {}
      },
      2: {
        attr: this.CYCLETYPEID,
        key: 'WEEKLY',
        text: 'TEXT_WEEKLY',
        child: {
          0: {
            attr: this.FIXEDCYCLEKEYS.DAYS_OF_WEEK,
            text: 'TEXT_END_DAY',
            value: this.getOptions(cycleConfigurationData.DaysOfWeek)
          }
        }
      },
      3: {
        attr: this.CYCLETYPEID,
        key: 'BI_WEEKLY',
        text: 'TEXT_BI_WEEKLY',
        child: {
          0: {
            //attr: 'biWeeklyIntervals',
            attr: this.FIXEDCYCLEKEYS.BI_WEEKLY,
            text: 'TEXT_BI_WEEKLY',
            value: this.getOptions(this.biWeeklyData['biWeeklyData'])
          }
        }
      },
      4: {
        attr: this.CYCLETYPEID,
        key: this.SEMIMONTHLY,
        text: 'TEXT_SEMI_MONTHLY',
        child: {
          0: {
            attr: this.FIXEDCYCLEKEYS.FIRST_DAY_OF_MONTH,
            text: 'TEXT_1ST_END_DAY',
            type: 'daysInMonth',
            value: ''
          },
          1: {
            attr: this.FIXEDCYCLEKEYS.SECOND_DAY_OF_MONTH,
            text: 'TEXT_2ND_END_DAY',
            type: 'daysInMonth',
            value: ''
          }
        }
      },
      5: {
        attr: this.CYCLETYPEID,
        key: 'QUARTERLY',
        text: 'TEXT_QUARTERLY',
        child: {
          0: {
            attr: this.FIXEDCYCLEKEYS.START_MONTH,
            text: 'TEXT_STARTING_MONTHS',
            value: this.getOptions(cycleConfigurationData.QuarterMonth)
          },
          1: {
            attr: this.FIXEDCYCLEKEYS.START_DAY,
            text: 'TEXT_STARTING_DAY',
            type: 'daysInMonth',
            value: ''
          }
        }
      },
      6: {
        attr: this.CYCLETYPEID,
        key: 'ANNUALLY',
        text: 'TEXT_ANNUAL',
        child: {
          0: {
            attr: this.FIXEDCYCLEKEYS.START_MONTH,
            text: 'TEXT_STARTING_MONTH',
            value: this.getOptions(cycleConfigurationData.MonthData)
          },
          1: {
            attr: this.FIXEDCYCLEKEYS.START_DAY,
            text: 'TEXT_STARTING_DAY',
            type: 'daysInMonth-depend',
            value: ''
          }
        }
      },
      7: {
        attr: this.CYCLETYPEID,
        key: 'SEMI_ANNUALLY',
        text: 'TEXT_SEMI_ANNUAL',
        child: {
          0: {
            attr: this.FIXEDCYCLEKEYS.START_MONTH,
            text: 'TEXT_STARTING_MONTH',
            value: this.getOptions(cycleConfigurationData.MonthData)
          },
          1: {
            attr: this.FIXEDCYCLEKEYS.START_DAY,
            text: 'TEXT_STARTING_DAY',
            type: 'daysInMonth-depend',
            value: ''
          }
        }
      },
    };
  }

  getEbcrInterVals() {
    const interVals = JSON.parse(JSON.stringify(this.getInterVals()));
    for (const index in interVals) {
      if (['DAILY', 'SEMI_MONTHLY'].indexOf(interVals[index]['key']) > 0) {
        delete interVals[index];
      }
    }
    return interVals;
  }

  getOptions(jsonData) {
    const options = {};
    for (const key in jsonData) {
      if (key !== undefined) {
        options[Object.keys(options).length] = {
          text: jsonData[key],
          key: key
        };
      }
    }
    return options;
  }

  getFixedCycle() {
    return {
      attr: this.CYCLEMODE,
      key: 'FIXED'
    };
  }

  getUsageCycle() {
    return cycleConfigurationData.UsageCycle;
  }

  setDatainService(billingDetails) {
    this.biWeeklyData = billingDetails;
    if (billingDetails['biWeeklyIntervals']) {
      this.biWeeklyData['biWeeklyData'] = {};
      for (let i = 0; i < billingDetails['biWeeklyIntervals'].length; i++) {
        if (billingDetails['biWeeklyIntervals'][i].dayInterval) {
          this.biWeeklyData['biWeeklyData'][i] = billingDetails['biWeeklyIntervals'][i].dayInterval;
        }
      }
    }
  }
}