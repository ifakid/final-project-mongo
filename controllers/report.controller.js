const asyncHandler = require("express-async-handler")
const Report = require("../models/report.model")

const addReport = asyncHandler(async (req,res) => {
    const { reportedBy, reportedItem, reportType, details } = req.body
    if (!(reportType && reportedBy)) {
        res.status(400)
        throw new Error("Field required")
    }
    const report = await Report.create({
        reportedBy,
        reportedItem,
        reportType,
        details,
        resolved: false
    })
    res.status(200).json(report)
})

const getReport = asyncHandler(async (req,res) => {
    var { resolved, page, count } = req.query
    let query = {}
    if (resolved) {
        query.resolved = Boolean(resolved)
    }
    if (!page) page = 1
    if (!count) count = 20

    const result = await Report.find(query).skip((page-1)*count).limit(count)
    res.status(200).json({ "reports": result })
})

const markAsResolved = asyncHandler(async (req,res) => {
    const { id } = req.body
    if (!id) {
        res.status(400)
        throw new Error("Field required")
    }
    const result = await Report.findByIdAndUpdate(id, { resolved: true })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

module.exports = { addReport, getReport, markAsResolved }