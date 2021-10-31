class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // console.log(this.queryString)
        const queryObj = { ...this.queryString }  // structuring from ES6, make a copy object
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(e => delete queryObj[e]);

        // 1B) Advanced filtering

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr));  // Tour.find().find(JSON.parse(queryStr))  ~ is acceptable.

        return this;  // this means the entire object 
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log("sortBy: ", sortBy);
            this.query = this.query.sort(sortBy);
        } else {
            // this.query = this.query.sort('-createdAt');
            this.query = this.query.sort('_id');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            console.log("limitFields: ", fields)
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        // page=3&limit=10  1-10 page 1, 11-20 page 2, 21-30 page 3
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

}

module.exports = APIFeatures;