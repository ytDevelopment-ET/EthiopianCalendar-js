/*
 * Ethiopian Calendar-js v1.0.1 : https://github.com/ytDevelopment-ET/EthiopianCalendar
 *
 * Copyright (©) 2019-2021 ytDevelopment
 * http://ytdevelopment.zya.me
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.

 * Written by Yonathan Tesfaye on Nov-10 2021 at 2:16 AM
 * Last updated on Nov-14 2021 at 09:00 AM
 * Contact Me : yt040448@gmail.com
 *
 * Gregorian Calendar(GC) to Ethiopian Calendar(EC) Converter for javascript
 *
 * ALL THE ABOVE COPYRIGHT NOTICE SHALL BE INCLUDED IN ALL COPIES OR SUBSTANTIAL PORTIONS OF THE SOFTWARE.
 *
 */

class EthiopianCalendar {
	get FIVE() { return 5; }
	get SIX() { return 6; }

	get GregorianMonthLength() { return [31, [29, 28], 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; }
	get EthiopianMonth() { return [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4]; }

	get GregorianMonthName() { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; }
	get EthiopianMonthName() { return ["መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት", "መጋቢት", "ሚያዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሀሴ", "ጳጉሜ"]; }

	get GregorianDayName() { return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; }
	get EthiopianDayName() { return ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ", "እሁድ"]; }

	get WEEK_DAY_LIST() { return {"Monday" : 0, "Tuesday" : -1, "Wednesday" : -2, "Thursday": -3, "Friday" : -4, "Saturday" : -5, "Sunday" : -6}; }

	get MonthDifference() { return [8, 7, 9, 8, 8, 7, 7, 6, [5, 6], [10, 11], [9, 10], [9, 10]]; }

	constructor(date) {
		if (!date instanceof Date) {
			date = new Date();
		}

		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
		this.day = date.getDate();

		if (this.year > 0 && this.month > 0 && this.month <= 12 && this.day > 0 && this.day <= this.GCMonthLength()) {
			this.SetLeapYear();

			var EC_year = this.year - this.YearDifference();
			var EC_month = this.EthiopianMonth[this.month - 1];
			var EC_day;

			if (this.month >= 9 && this.month <= 12) {
				if (this.month == 9) {
					EC_day = this.day - (this.MonthDifference[this.month - 1][this.leap_year_index] + this.leap_year_index + this.LeapYearAddition());
					if (EC_day >= -5 && EC_day <= 0) {
						EC_day += 6;
						EC_month = 13;
					} else if (EC_day == 0) {
						EC_day = 1;
					} else if (EC_day < -5) {
						EC_day += 6;
					} else {
						EC_day += 1;
					}
				} else {
					EC_day = this.day - (this.MonthDifference[this.month - 1][this.leap_year_index]);
				}
			} else {
				EC_day = this.day - this.MonthDifference[this.month - 1];
			}

			if (EC_day <= 0) {
				EC_day = 30 + EC_day;
				if (this.EthiopianMonth[this.month - 2] != null) {
					EC_month = this.EthiopianMonth[this.month - 2];
				} else {
					EC_month = this.EthiopianMonth[(this.month - 2) + this.EthiopianMonth.length];
				}
			}

			this.EC_year = EC_year;
			this.EC_month = EC_month;
			this.EC_day = EC_day;

			this.Converted = true;

			this.GCDate = new Date(date.toDateString());//strtotime(this.year+"-"+this.month+"-"+this.day);
			this.GCDate.getDay = function() {
				var day = date.getDay();
				return day == 0 ? 6 : day - 1;
			};
			this.GCDate.getMonth = function() {
				var month = date.getMonth();
				return month + 1;
			};
		}
	}

	SetLeapYear() {
		var leap_year_division = (this.year - 11) / 4;

		if (Number.isInteger(leap_year_division)) {
			this.leap_year = this.SIX;
			this.leap_year_index = 1;
		} else {
			this.leap_year = this.FIVE;
			this.leap_year_index = 0;
		}
	}

	YearDifference() {
		if (this.month == 9) {
			if ((this.day >= 11 && this.leap_year == this.FIVE) || (this.day >= 12 && this.leap_year == this.SIX)) {
				return 7;
			} else {
				return 8;
			}
		} else if (this.month > 9) {
			return 7;
		} else {
			return 8;
		}
	}

	LeapYearAddition() {
		if (this.leap_year == this.FIVE) {
			return +1;
		} else if (this.leap_year == this.SIX) {
			return -1;
		} else {
			return 1;
		}
	}

	AddZero(int) {
		if (int.toString().length == 1) {
			return "0" + int;
		} else {
			return int;
		}
	}

	EC_date_format(format) {
		if (this.Converted) {
			format = format.replace(/Y/g, this.EC_year);
			format = format.replace(/y/g, this.EC_year.toString().substr(2, 2));

			format = format.replace(/M/g, this.EthiopianMonthName[this.EC_month - 1]);
			format = format.replace(/m/g, this.AddZero(this.EC_month));

			format = format.replace(/d/g, this.AddZero(this.EC_day));
			format = format.replace(/D/g, this.EthiopianDayName[this.GCDate.getDay()]);

			return format;
		} else {
			return "";
		}
	}

	GCMonthLength() {
		if (this.month == 2) {
			return this.GregorianMonthLength[this.month - 1][isInteger(this.year / 4) ? 0 : 1];
		} else {
			return this.GregorianMonthLength[this.month - 1];
		}
	}

	MatchDay(count_day, today_int, return_true, return_false) {
		if (count_day == today_int) {
			return return_true;
		} else {
			return return_false;
		}
	}

	GetLeapYear() {
		if (this.Converted) {
			return this.leap_year;
		} else {
			return "";
		}
	}

	GetECDate(format) {
		if (this.Converted) {
			return this.EC_date_format(format);
		} else {
			return "";
		}
	}

	GetECMonthLength() {
		if (this.Converted) {
			if (this.EC_month == 13) {
				return this.leap_year;
			} else {
				return 30;
			}
		} else {
			return 0;
		}
	}

	GetGCDate(format) {
		if (this.Converted) {
			format = format.replace(/Y/g, this.GCDate.getFullYear());
			format = format.replace(/y/g, this.GCDate.getFullYear().toString().substr(2, 2));

			format = format.replace(/M/g, (this.GregorianMonthName[this.GCDate.getMonth() - 1]).substr(0, 3));
			format = format.replace(/m/g, this.AddZero(this.GCDate.getMonth()));

			format = format.replace(/d/g, this.AddZero(this.GCDate.getDate()));
			format = format.replace(/D/g, (this.GregorianDayName[this.GCDate.getDay()]).substr(0, 3));

			return format;
		} else {
			return "";
		}
	}

	GetGCMonthFullName() {
		if (this.Converted) {
			return this.GregorianMonthName[this.GCDate.getMonth() - 1];
		} else {
			return "";
		}
	}

	GetGCDayFullName() {
		if (this.Converted) {
			return this.GregorianDayName[this.GCDate.getDay()];
		} else {
			return "";
		}
	}

	GetGCMonthLength() {
		if (this.Converted) {
			return this.GCMonthLength();
		} else {
			return 0;
		}
	}

	ECDrawCalendar() {
		var cal = "";
		if (this.Converted) {
			cal += "<table class='calendar'><tr><th>ሰኞ</th><th>ማክሰኞ</th><th>ረቡዕ</th><th>ሐሙስ</th><th>ዓርብ</th><th class='rest'>ቅዳሜ</th><th class='rest'>እሁድ</th></tr>";

			var date = this.EC_day;
			while (date > 7) {
				date -= 7;
			}

			date = -(((-this.WEEK_DAY_LIST[this.GetGCDayFullName()]) + 1) - date);
			if (date > 0) {
				date = date - 7;
			}

			var count_day = date;
			while (count_day < this.GetECMonthLength()) {
				if (date >= -6 && date <= 0) {
					count_day++;
					if (count_day > 0) {
						if (Number.isInteger((count_day - (7 + date)) / 7)) {
							cal += "<td class='" + this.MatchDay(count_day, this.GetECDate('d'), 'today', 'day') + "'>" + count_day + "</td><tr>";
						} else {
							cal += "<td class='" + this.MatchDay(count_day, this.GetECDate('d'), 'today', 'day') + "'>" + count_day + "</td>";
						}
					} else {
						cal += "<td></td>";
					}
				} else {
					break;
				}
			}
			cal += "</tr><tr><td class='today' colspan='7'>" + this.GetECDate('Y-m-d / D M d Yዓ.ም') + "</td></tr></table>";
		}
		return cal;
	}

	GCDrawCalendar() {
		var cal = "";
		if (this.Converted) {
			cal += "<table class='calendar'><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th class='rest'>Sun</th></tr>";

			var date = this.day;
			while (date > 7) {
				date -= 7;
			}

			date = -(((-this.WEEK_DAY_LIST[this.GetGCDayFullName()]) + 1) - date);
			if (date > 0) {
				date = date - 7;
			}

			var count_day = date;
			while (count_day < this.GetGCMonthLength()) {
				if (date >= -6 && date <= 0) {
					count_day++;
					if (count_day > 0) {
						if (Number.isInteger((count_day - (7 + date)) / 7)) {
							cal += "<td class='" + this.MatchDay(count_day, this.GetGCDate('d'), 'today', 'day') + "'>" + count_day + "</td><tr>";
						} else {
							cal += "<td class='" + this.MatchDay(count_day, this.GetGCDate('d'), 'today', 'day') + "'>" + count_day + "</td>";
						}
					} else {
						cal += "<td></td>";
					}
				} else {
					break;
				}
			}
			cal += "</tr><tr><td class='today' colspan='7'>" + this.GetGCDate('Y-m-d / ') + this.GetGCDayFullName() + " " + this.GetGCMonthFullName() + this.GetGCDate(" d Y") + "</td></tr></table>";
		}
		return cal;
	}
}
