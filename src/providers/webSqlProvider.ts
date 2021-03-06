import {Provider} from "./provider";
import Utils from "../utils";

export default class WebSqlProvider implements Provider {
    constructor(protected readonly db: string,
                protected readonly openDatabase?: (name: string) => any) {
    }

    executeSql(sql: string, args: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            let conn = this.openConnection();
            conn.transaction(tx =>
                tx.executeSql(sql, args || [],
                    (tx, res) => resolve(res),
                    (tx, e) => {
                        reject(e);
                        return true;
                    }), e => reject(e));
        });
    }

    batchSql(batch: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let conn = this.openConnection();
            conn.transaction(tx =>
                Utils.eachAsync(batch,
                    (item, next) => {
                        tx.executeSql(item[0], item[1], () => next(), (tx, e) => next(e))
                    },
                    e => !e ? resolve() : reject(e)), e => reject(e));
        });
    }

    protected openConnection(): any {
        return this.openDatabase ?
            this.openDatabase(this.db) :
            window['openDatabase'](this.db, '1', '', 5000000);
    }
}
