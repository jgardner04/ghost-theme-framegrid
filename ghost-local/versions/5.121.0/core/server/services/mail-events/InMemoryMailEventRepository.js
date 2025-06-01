"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMailEventRepository = void 0;
const InMemoryRepository_1 = require("../lib/InMemoryRepository");
class InMemoryMailEventRepository extends InMemoryRepository_1.InMemoryRepository {
    toPrimitive() {
        return {};
    }
}
exports.InMemoryMailEventRepository = InMemoryMailEventRepository;
