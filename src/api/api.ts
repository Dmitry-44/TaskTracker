import type{ FilterPayload } from '@/api';


export class Api {

    select: FilterPayload['select'] = []
	filter: FilterPayload['filter'] = {}
	options: FilterPayload['options'] = {}

	mergeFilters(filters?: FilterPayload): FilterPayload {
        if(!filters){
            return {
                select: this.select,
                filter: this.filter,
                options: this.options
            };
        }
		const select = filters.select.length>0 ? filters.select : this.select
		const filter = Object.assign(this.filter, filters.filter)
		const options = Object.assign(this.options, filters.options)
		return {
			select,
			filter,
			options
		}
	}
}