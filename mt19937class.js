/* Modified from http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/VERSIONS/JAVASCRIPT/java-script.html */
function MersenneTwister19937() {
	"use strict";
	var N, M, MATRIX_A, UPPER_MASK, LOWER_MASK, mt, mti, i;
	N = 624;
	M = 397;
	MATRIX_A = 0x9908b0df;
	UPPER_MASK = 0x80000000;
	LOWER_MASK = 0x7fffffff;
	mt = [];
	for (i = 0; i < N; i++) {
		mt[i] = 0;
	}
	mti = N + 1;
	function unsigned32(n1) {
		return n1 < 0 ? (n1 ^ UPPER_MASK) + UPPER_MASK : n1;
	}
	function subtraction32(n1, n2) {
		return n1 < n2 ? unsigned32((0x100000000 - (n2 - n1)) & 0xffffffff) : n1 - n2;
	}
	function addition32(n1, n2) {
		return unsigned32((n1 + n2) & 0xffffffff);
	}
	function multiplication32(n1, n2) {
		var sum, i;
		sum = 0;
		for (i = 0; i < 32; ++i) {
			if ((n1 >>> i) & 0x1) {
				sum = addition32(sum, unsigned32(n2 << i));
			}
		}
		return sum;
	}
	this.init_genrand = function (s) {
		mt[0] = unsigned32(s & 0xffffffff);
		for (mti = 1; mti < N; mti++) {
			mt[mti] = addition32(multiplication32(1812433253, unsigned32(mt[mti - 1] ^ (mt[mti - 1] >>> 30))), mti);
			mt[mti] = unsigned32(mt[mti] & 0xffffffff);
		}
	};
	this.init_by_array = function (init_key, key_length) {
		var i, j, k, x, dbg;
		this.init_genrand(19650218);
		i = 1;
		j = 0;
		if (N > key_length) {
			x = N;
		} else {
			x = key_length;
		}
		for (k = x; k > 0; k--) {
			mt[i] = addition32(addition32(unsigned32(mt[i] ^ multiplication32(unsigned32(mt[i - 1] ^ (mt[i - 1] >>> 30)), 1664525)), init_key[j]), j);
			mt[i] = unsigned32(mt[i] & 0xffffffff);
			i++;
			j++;
			if (i >= N) {
				mt[0] = mt[N - 1];
				i = 1;
			}
			if (j >= key_length) {
				j = 0;
			}
		}
		for (k = N - 1; k > 0; k--) {
			mt[i] = subtraction32(unsigned32((dbg = mt[i]) ^ multiplication32(unsigned32(mt[i - 1] ^ (mt[i - 1] >>> 30)), 1566083941)), i);
			mt[i] = unsigned32(mt[i] & 0xffffffff);
			i++;
			if (i >= N) {
				mt[0] = mt[N - 1];
				i = 1;
			}
		}
		mt[0] = 0x80000000;
	};
	this.genrand_int32 = function () {
		var y, mag01, kk, x;
		mag01 = [0x0, MATRIX_A];
		if (mti >= N) {
			if (mti === (N + 1)) {
				this.init_genrand(5489);
			}
			for (kk = 0; kk < (N - M); kk++) {
				y = unsigned32((mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK));
				mt[kk] = unsigned32(mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1]);
			}
			x = kk;
			for (kk = x; kk < (N - 1); kk++) {
				y = unsigned32((mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK));
				mt[kk] = unsigned32(mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1]);
			}
			y = unsigned32((mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK));
			mt[N - 1] = unsigned32(mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1]);
			mti = 0;
		}
		y = mt[mti++];
		y = unsigned32(y ^ (y >>> 11));
		y = unsigned32(y ^ ((y << 7) & 0x9d2c5680));
		y = unsigned32(y ^ ((y << 15) & 0xefc60000));
		y = unsigned32(y ^ (y >>> 18));
		return y;
	};
	/* generates a random number on [0,0x7fffffff]-interval */
	this.genrand_int31 = function () {
		return (this.genrand_int32() >>> 1);
	};
	/* generates a random number on [0,1]-real-interval */
	this.genrand_real1 = function () {
		return this.genrand_int32() * (1.0 / 4294967295.0);
	};
	/* generates a random number on [0,1)-real-interval */
	this.genrand_real2 = function () {
		return this.genrand_int32() * (1.0 / 4294967296.0);
	};
	/* generates a random number on (0,1)-real-interval */
	this.genrand_real3 = function () {
		return ((this.genrand_int32()) + 0.5) * (1.0 / 4294967296.0);
	};
	/* generates a random number on [0,1) with 53-bit resolution */
	this.genrand_res53 = function () {
		var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
		return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
	};
}
