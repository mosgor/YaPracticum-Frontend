interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

interface Error {
	error: string;
}

interface ProductList {
	total: number;
	items: Product[];
}

type ProductItem = Product | Error;

interface Order {
	items: string[];
	payment: string;
	total: number;
	address: string;
	email: string;
	phone: string;
}

interface SuccessOrder {
	id: string;
	total: number;
}

type OrderResponse = SuccessOrder | Error;

class ShopModel {
	private products: Product[];
	private cart: Product[] = [];

	async fetchProducts(): Promise<void> {
		try {
			const response = await fetch("/api/product/");
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			const data: ProductList = await response.json();
			this.products = data.items || [];
		} catch (error) {
			console.error("Error loading products:", error);
			throw error;
		}
	}

	async fetchProduct(id: string): Promise<Product> {
		function isError(response: any): response is Error {
			return response.error !== undefined;
		}

		try {
			const response = await fetch("/api/product/" + id);
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			const data: ProductItem = await response.json();
			if (isError(data)) {
				console.error("API error:", data.error);
			} else {
				return data;
			}
		} catch (error) {
			console.error("Error loading products:", error);
			throw error;
		}
	}

	async fetchPostOrder(id: string, total: number): Promise<OrderResponse> {
		try {
			const response =  await fetch("/api/order/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: id,
					total: total,
				})
			})
			return await response.json()
		}
		catch (error) {
			console.error("Error post order:", error);
			throw error;
		}
	}

	getProducts(): Product[] {
		return this.products;
	}

	addToCart(productId: string): void {
		const product = this.products.find(item => item.id === productId);
		if (product) {
			this.cart.push(product);
		}
	}

	removeFromCart(productId: string): void {
		this.cart = this.cart.filter(item => item.id !== productId);
	}

	getCart(): Product[] {
		return this.cart;
	}

	getCartTotal(): number {
		return this.cart.reduce((total, item) => total + item.price, 0);
	}
}

interface IShopView {
	displayList(prod: Product[]): void;
	displayCart(cart: Product[], totalPrice: number): void;
}

interface IShopPresenter {
	onViewLoaded(): void;
	addToCart(id: string): void;
	removeFromCart(id: string): void;
	onOrderFormed(order: Order): void;
}

class ShopView implements IShopView {
	displayList(prod: Product[]): void {return}
	displayCart(cart: Product[], totalPrice: number): void {return}
}

class ShopPresenter implements IShopPresenter {
	private view: ShopView
	private model: ShopModel

	constructor(view: ShopView, model: ShopModel) {
		this.view = view;
		this.model = model;
	}

	onViewLoaded(): void {return}
	addToCart(id: string): void {return}
	removeFromCart(id: string): void {return}
	onOrderFormed(order: Order): void {return}
}